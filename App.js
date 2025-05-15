import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import PaginaPrincipal from "./screens/src/paginaPrincipal";
import listarImagens from "./screens/src/listarImagens";
import listarVideos from "./screens/src/listarVideos";
import UploadVideo from "./screens/src/uploadVideos";
import UploadImagens from "./screens/src/uploadImagens";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="paginaPrincipal">
        <Stack.Screen name="paginaPrincipal" component={PaginaPrincipal} />
        <Stack.Screen name="listarImagens" component={listarImagens} />
        <Stack.Screen name="listarVideos" component={listarVideos} />
        <Stack.Screen name="UploadVideo" component={UploadVideo} />
        <Stack.Screen name="UploadImagens" component={UploadImagens} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}