import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import PaginaPrincipal from "./SRC/screens/paginaPrincipal";
import adicionarJogador from "./SRC/screens/criarjogador";
import listarImagens from "./SRC/screens/listarImagens";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
       <Stack.Navigator initialRouteName="paginaPrincipal">
        <Stack.Screen name="paginaPrincipal" component={PaginaPrincipal} />
        <Stack.Screen name="listaJogadores" component={listarImagens} />
        <Stack.Screen name="adicionarJogador" component={adicionarJogador} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}