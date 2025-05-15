import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import PaginaPrincipal from "./screens/src/paginaPrincipal";
import listarImagens from "./screens/src/listarImagens";
import listarVideos from "./screens/src/listarVideos";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="paginaPrincipal">
        <Stack.Screen name="paginaPrincipal" component={PaginaPrincipal} />
        <Stack.Screen name="listaJogadores" component={listarImagens} />
        <Stack.Screen name="listarVideos" component={listarVideos} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}