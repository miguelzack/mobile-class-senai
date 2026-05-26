import { ScheduleCard } from "../../components/scheduleCard"
import { Container, Greetings, GreetingsAvatar, GreetingsSpan, GreetingsText, GreetingsTitle } from "./style"

export const Home = () => {
    return (
        <Container>
            <Greetings>
                <GreetingsTitle>
                    <GreetingsSpan>Hello,</GreetingsSpan>
                    <GreetingsText>Hi James</GreetingsText>
                </GreetingsTitle>
                <GreetingsAvatar 
                source={require("../../assets/greetings-avatar.png")} />
            </Greetings>
            <ScheduleCard />
        </Container>
    )
}