import styled from "styled-components/native";

export const Container = styled.View`
    flex: 1;
    border: 1px solid red;
    display: flex;
    padding: 64px 24px;
    background-color: "#FFFFFF";
`

export const Greetings = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`

export const GreetingsTitle = styled.View`
    display: flex;
    gap: 6px;
`

export const GreetingsSpan = styled.Text`
    color: "#8696BB";
    font-size: 16px;
`

export const GreetingsText = styled.Text`
    color: "#0D1B34";
    font-size: 20px;
`

export const GreetingsAvatar = styled.Image`
    width: 56px;
    height: 56px;
`

