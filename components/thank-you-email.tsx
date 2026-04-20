import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
} from "@react-email/components";

export default function ThankYouEmail({
  customerName,
  courseUrl,
}: {
  customerName: string;
  courseUrl: string;
}) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
        <Container
          style={{
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "8px",
            margin: "40px auto",
          }}
        >
          <Heading>
            {customerName}, dziękujemy za kupienie dostępu do zadań maturalnych!
          </Heading>
          <Text>
            Dziękujemy za kupienie dostępu do zadań maturalnych{" "}
            <strong>Españolita</strong>. Zapraszamy do nauki!
          </Text>
          <Text>Możesz teraz zarejestrować się i zacząć naukę:</Text>
          <Button href={courseUrl}>Zarejestruj się</Button>
        </Container>
      </Body>
    </Html>
  );
}
