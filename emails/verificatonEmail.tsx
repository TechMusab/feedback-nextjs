import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  username: string;
  otp: string;
}

export const OtpEmail = ({ username, otp }: OtpEmailProps) => {
  const previewText = `Your OTP Code`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-white font-sans px-4 py-6">
          <Preview>{previewText}</Preview>
          <Container className="max-w-md mx-auto border border-gray-200 rounded p-6">
            <Heading className="text-center text-xl font-bold text-black mb-4">
              Your OTP Code
            </Heading>
            <Text className="text-base text-black mb-2">
              Hello {username},
            </Text>
            <Text className="text-base text-black mb-6">
              Use the following OTP to continue:
            </Text>
            <Text className="text-2xl font-bold text-center text-black bg-gray-100 py-3 rounded">
              {otp}
            </Text>
            <Text className="text-sm text-gray-600 mt-6">
              This OTP is valid for a limited time. If you didn’t request it, you can safely ignore this email.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};


export default OtpEmail;
