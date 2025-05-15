import React from "react";
import { View, Button, StyleSheet, ImageBackground, Pressable, Text, TouchableOpacity } from "react-native";

export default function paginaPrincipal({ navigation }) {
    return (
       
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("listaJogadores")}>
                    <Text style={styles.buttonText}>Listar Jogadores</Text>
                </TouchableOpacity>

            </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: 20,
    },
    button: {
        backgroundColor: "#575ff0",
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginVertical: 10,
        width: '80%',
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    buttonText: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
    },
});