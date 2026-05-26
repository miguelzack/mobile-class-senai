import {Container, Greetings, GreetingsAvatar, GreetingsSpan, GreetingsText, GreetingsTItle} from "./style";

export const Home = () => {
  return (
        <Container>
          <Greetings>
            <GreetingsTItle>
            <GreetingsSpan>Hello,</GreetingsSpan>
              <GreetingsText>Hi James</GreetingsText>
            </GreetingsTItle>
            <GreetingsAvatar source={require('../../assets/greetings-avatar.png')}/>
          </Greetings>
        </Container>
  )
}
