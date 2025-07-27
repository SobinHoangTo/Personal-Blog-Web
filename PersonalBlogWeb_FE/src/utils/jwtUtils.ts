// JWT utility functions
export interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
}

export function safeDecodeJWT(token: string): DecodedJWT | null {
  try {
    // Remove any URL encoding first
    let cleanToken = token;
    if (token.includes("%")) {
      cleanToken = decodeURIComponent(token);
    }

    console.log("Original token:", token);
    console.log("Clean token:", cleanToken);

    // Split the token into parts
    const parts = cleanToken.split(".");
    if (parts.length !== 3) {
      console.error("JWT token should have 3 parts, but has:", parts.length);
      return null;
    }

    const [headerB64, payloadB64, signature] = parts;

    // Decode header
    const header = decodeBase64URL(headerB64);
    console.log("JWT Header:", header);

    // Decode payload
    const payload = decodeBase64URL(payloadB64);
    console.log("JWT Payload:", payload);

    return {
      header: JSON.parse(header),
      payload: JSON.parse(payload),
      signature,
    };
  } catch (error) {
    console.error("Error decoding JWT:", error);
    console.error("Problematic token:", token);
    return null;
  }
}

function decodeBase64URL(str: string): string {
  try {
    // Replace URL-safe characters
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }

    console.log("Decoding base64:", base64);

    // Decode using atob
    const decoded = atob(base64);

    // Convert to proper UTF-8 string to handle Vietnamese characters
    try {
      // Use TextDecoder for proper UTF-8 handling
      const bytesArr: number[] = [];
      for (let i = 0; i < decoded.length; i++) {
        bytesArr.push(decoded.charCodeAt(i));
      }
      const bytes = new Uint8Array(bytesArr);
      const utf8Decoded = new TextDecoder("utf-8").decode(bytes);
      console.log("Decoded string:", utf8Decoded);
      return utf8Decoded;
    } catch {
      // Fallback to original decoded string if UTF-8 conversion fails
      console.log("UTF-8 conversion failed, using original:", decoded);
      return decoded;
    }
  } catch (error) {
    console.error("Error in base64 decode:", error);
    console.error("Input string:", str);
    throw error;
  }
}

export function extractUserFromJWT(payload: any) {
  return {
    username:
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
      "",
    email:
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
      ] || "",
    fullName:
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"
      ] || "",
    avatar: payload["avatar"] || "",
  };
}
