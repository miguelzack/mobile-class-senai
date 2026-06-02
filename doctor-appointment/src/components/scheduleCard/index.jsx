import {
    Container,
    ScheduleBottom,
    ScheduleBottomContainer,
    ScheduleBottomIcon,
    ScheduleBottomTitle,
    ScheduleTop,
    ScheduleTopAvatar,
    ScheduleTopDescription, ScheduleTopIcon,
    ScheduleTopLabel,
    ScheduleTopTitle
} from "./style.js"

export const ScheduleCard = () => {
    return (<Container>
        <ScheduleTop>
            <ScheduleTopAvatar source={require("../../assets/doctor.png")}/>
            <ScheduleTopTitle>
                <ScheduleTopLabel>
                    Dr. Imram Syahir
                </ScheduleTopLabel>
                <ScheduleTopDescription>
                    General Doctor
                </ScheduleTopDescription>
            </ScheduleTopTitle>
            <ScheduleTopIcon source={require("../../assets/arrow-right.png")}/>
        </ScheduleTop>
        <ScheduleBottom>
            <ScheduleBottomContainer>
                <ScheduleBottomIcon source={require("../../assets/calendar.png")}/>
                <ScheduleBottomTitle>Sunday, 12 June</ScheduleBottomTitle>
            </ScheduleBottomContainer>
            <ScheduleBottomContainer>
                <ScheduleBottomIcon source={require("../../assets/clock.png")}/>
                <ScheduleBottomTitle>11:00 - 12:00 AM</ScheduleBottomTitle>
            </ScheduleBottomContainer>
        </ScheduleBottom>
    </Container>)
}
