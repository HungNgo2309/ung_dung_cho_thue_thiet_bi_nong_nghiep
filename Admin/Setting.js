import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
import auth from '@react-native-firebase/auth';

const Setting =({navigation})=>{
    const handleLogout = () => {
        auth().signOut().catch(error => console.log('Error logging out: ', error));
        };
    return(
        <View > 
            <Button onPress={handleLogout}>Logout</Button>
            <Button onPress={()=>navigation.navigate("AdminChatList")}>ChatList</Button>
        </View>
    )
}
export default Setting;