import { insertNewProvider } from "@/lib/routes";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { encrypt } from "@/lib/auth";
import { sendMail } from "@/lib/services/mailService";

const TypeReqProviderSignUp = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  lat: z.number(),
  serviceName: z.string(),
  long: z.number(),
  onlinePrice: z.number(),
  offlinePrice: z.number(),
  mobile: z.number(),
  slots: z.array(z.number()),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const providerUbj = TypeReqProviderSignUp.parse(body);
    const hashedPassword = await bcrypt.hash(providerUbj.password, 10);
    const { password: removedpwd, ...withoutpwdprovider } = providerUbj;
    const Provider = await insertNewProvider({
      ...withoutpwdprovider,
      slotsArray: providerUbj.slots,
      password: hashedPassword,
      offlineDuration: 2,
    });
    const providerWithPwd = Provider[0];
    if ("message" in Provider) {
      return NextResponse.json({ message: Provider.message }, { status: 400 });
    }
    // Calculating the expiry time (1 day from now)
    const { password, ...provider } = providerWithPwd;
    const token = await encrypt({ email : provider?.email, type : "Provider" });
    const verificationLink = `https://doorstep-mu.vercel.app/verify-email?token=${token}`;

     await sendMail(
      "Verify Your Email Address",
      provider?.email,
      `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: #333333;
            margin-bottom: 20px;
            font-size: 24px;
        }
        p {
            color: #666666;
            margin-bottom: 20px;
            font-size: 16px;
        }
        .button {
            background-color: #007bff;
            color: white;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            display: inline-block;
            margin-top: 20px;
        }
        .button:hover {
            background-color: #0056b3;
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #999999;
        }
        .footer a {
            color: #007bff;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verify Your Email Address</h1>
        <p>Thank you for registering with Doorstep. To complete your registration, please verify your email address by clicking the button below.</p>
        <a href="${verificationLink}" class="button">Verify Email Address</a>
        <p>If you did not create an account with us, please ignore this email.</p>
        <div class="footer">
            <p>If you have any questions or need assistance, feel free to contact us at <a href="mailto:contact@doorstep.com">contact@doorstep.com</a>.</p>
            <p>Thanks, Doorstep</p>
        </div>
    </div>
</body>
</html>
`
    );
    
    const response = NextResponse.json(
      {
        message: "Provider Created Successfully",
        provider,
      },
      { status: 200 }
    );

    return response;
  } catch (e) {
    return NextResponse.json(
      {
        error: e,
      },
      { status: 400 }
    );
  }
}
