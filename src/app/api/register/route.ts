import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { v2 as cloudinary } from "cloudinary";

const SHEET_ID = process.env.GOOGLE_SHEET_ID || "<YOUR_SHEET_ID_HERE>";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function formatPrivateKey(key: string): string {
  let formattedKey = key;

  // Remove surrounding quotes if present
  if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
    formattedKey = formattedKey.slice(1, -1);
  }
  if (formattedKey.startsWith("'") && formattedKey.endsWith("'")) {
    formattedKey = formattedKey.slice(1, -1);
  }
  
  // Replace literal \n with actual newlines
  formattedKey = formattedKey.split('\\n').join('\n');
  
  // If still no newlines, try to add them
  if (!formattedKey.includes('\n')) {
    formattedKey = formattedKey
      .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
      .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');
  }
  
  console.log('Private key format check:');
  console.log('- Has BEGIN marker:', formattedKey.includes('-----BEGIN PRIVATE KEY-----'));
  console.log('- Has END marker:', formattedKey.includes('-----END PRIVATE KEY-----'));
  console.log('- Has newlines:', formattedKey.includes('\n'));
  console.log('- Key length:', formattedKey.length);
  
  return formattedKey;
}

async function getAuth() {
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY || '';
  
  // Check if credentials are properly configured
  if (!process.env.GOOGLE_PROJECT_ID || !process.env.GOOGLE_CLIENT_EMAIL || !rawPrivateKey) {
    throw new Error(
      "Missing Google service account credentials. Please check your .env file and ensure " +
      "GOOGLE_PROJECT_ID, GOOGLE_CLIENT_EMAIL, and GOOGLE_PRIVATE_KEY are set."
    );
  }
  
  const privateKey = formatPrivateKey(rawPrivateKey);
  
  const credentials = {
    type: "service_account" as const,
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key: privateKey,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
  };
  
  // Validate private key format
  if (!credentials.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error("Invalid private key format - missing PEM header. Please check GOOGLE_PRIVATE_KEY in .env");
  }
  
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.file",
    ],
  });
}

async function uploadToCloudinary(file: File): Promise<string> {
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    throw new Error(
      "Cloudinary not configured. Please check your .env file and ensure " +
      "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set."
    );
  }
  
  // Convert File to base64
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;
  
  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(base64, {
    folder: "hackhorizon-registrations",
    resource_type: "auto",
  });
  
  return result.secure_url;
}

export async function POST(req: NextRequest) {
  try {
    // Log start of request
    console.log("Received registration request");
    
    const formData = await req.formData();
    
    const teamName = formData.get("teamName") as string;
    const collegeName = formData.get("collegeName") as string;
    const leaderStr = formData.get("leader") as string;
    const membersStr = formData.get("members") as string;
    const additionalPhone = formData.get("additionalPhone") as string;
    const transactionId = formData.get("transactionId") as string;
    const paymentFile = formData.get("paymentScreenshot") as File | null;
    
    console.log("Form data received:", { teamName, collegeName, transactionId });
    
    // Validate required fields
    if (!teamName || !collegeName || !leaderStr || !membersStr || !transactionId) {
      console.error("Missing required fields");
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    console.log("Attempting to authenticate with Google");
    const auth = await getAuth();
    console.log("Google authentication successful");
    
    let paymentScreenshotUrl = "";
    
    // Upload image to Cloudinary
    if (paymentFile) {
      console.log("Uploading file to Cloudinary");
      paymentScreenshotUrl = await uploadToCloudinary(paymentFile);
      console.log("Cloudinary upload successful:", paymentScreenshotUrl);
    }
    
    console.log("Creating Google Sheets client");
    const sheets = google.sheets({ version: "v4", auth });
    const now = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    
    let leader, members;
    try {
      leader = JSON.parse(leaderStr);
      members = JSON.parse(membersStr);
      console.log("Parsed leader and members successfully");
    } catch (parseError: any) {
      console.error("Failed to parse JSON data:", parseError);
      return NextResponse.json(
        { success: false, error: "Invalid data format" },
        { status: 400 }
      );
    }
    
    // Always create array with all 5 member slots (leader + 4 members)
    // Fill empty slots with empty strings
    const allMembers = Array(4).fill(null).map((_, i) => 
      members[i] || { name: "", email: "" }
    );
    
    const row = [
      now,
      teamName,
      collegeName,
      leader.name,
      leader.email,
      leader.phone,
      additionalPhone,
      allMembers[0].name, allMembers[0].email,  // Member 2
      allMembers[1].name, allMembers[1].email,  // Member 3
      allMembers[2].name, allMembers[2].email,  // Member 4
      allMembers[3].name, allMembers[3].email,  // Member 5
      transactionId,
      paymentScreenshotUrl,
    ];
    
    console.log("Attempting to write to Google Sheets");
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A1",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: { values: [row] },
    });
    
    console.log("Successfully wrote to Google Sheets");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Registration error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error message:", error?.message);
    
    // Return detailed error message for debugging
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || "Unknown error",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}
