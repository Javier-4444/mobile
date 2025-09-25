import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Alert.alert("Éxito", "Inicio de sesión exitoso.");
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] }); 
    } catch (error) {
      let errorMessage = "Error al iniciar sesión. Intenta nuevamente.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/user-disabled':
          errorMessage = "Esta cuenta ha sido deshabilitada.";
          break;
        case 'auth/user-not-found':
          errorMessage = "No existe una cuenta con este correo electrónico.";
          break;
        case 'auth/wrong-password':
          errorMessage = "La contraseña es incorrecta.";
          break;
      }
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView 
        style={styles.keyboardAvoiding}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Image source={require('../assets/logo-santo-pecado.jpg')} style={styles.logo} resizeMode='contain' />
          
          {/* ✅ TÍTULO AGREGADO - ESTO FALTABA */}
          <Text style={styles.title}>INICIA SESIÓN</Text>

          <Text style={styles.label}>Correo</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="envelope" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese su correo"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese su contraseña"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  logo: {
    width: 300,
    height:200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff'
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#fff'
  },  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ff0000ff',
    marginBottom: 15,
    width: '100%',
    paddingVertical: 8,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ff0000ff',
    borderRadius: 8,
    backgroundColor: '#323743',
    color: '#fff',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#FD002A',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 20,
    color: '#FD002A',
    fontWeight: '500',
  },
});


