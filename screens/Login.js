import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../src/config/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  const isValidEmail = (email) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
  };

  
  const isLoginValid = email && password && isValidEmail(email);

  
  const getPasswordBorderColor = () => {
    if (password.length === 0) return '#ff0000ff';
    return '#ccc'; 
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      setShowErrorModal(true);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("El formato del correo electrónico no es válido. Verifica el dominio.");
      setShowErrorModal(true);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowSuccessModal(true);
    } catch (error) {
      let errorMessageText = "Error al iniciar sesión. Intenta nuevamente.";
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessageText = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/user-disabled':
          errorMessageText = "Esta cuenta ha sido deshabilitada.";
          break;
        case 'auth/user-not-found':
          errorMessageText = "No existe una cuenta con este correo electrónico.";
          break;
        case 'auth/wrong-password':
          errorMessageText = "La contraseña es incorrecta.";
          break;
      }
      setErrorMessage(errorMessageText);
      setShowErrorModal(true);
    }
  };


  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const handleErrorClose = () => {
    setShowErrorModal(false);
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
          
      
          <Text style={styles.title}>INICIA SESIÓN</Text>

          <Text style={styles.label}>Correo</Text>
          <View style={[styles.inputContainer, { borderColor: '#ff0000ff' }]}>
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
          <View style={[styles.inputContainer, { borderColor: getPasswordBorderColor() }]}>
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

          <TouchableOpacity 
            style={[styles.button, !isLoginValid && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={!isLoginValid}
          >
            <Text style={[styles.buttonText, !isLoginValid && styles.buttonTextDisabled]}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

 
      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleErrorClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleErrorClose}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>¡Éxito!</Text>
            <Text style={styles.modalMessage}>Inicio de sesión exitoso.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleSuccessClose}>
              <Text style={styles.modalButtonText}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom:15,
    color: '#fff'
  },  
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth:1,
    borderColor: '#ff0000ff', 
    borderRadius: 8,
    backgroundColor: '#323743',
    marginBottom: 15,
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal:16,
  },
  icon: {
    width: 25,        
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ff0000ff',
    borderRadius: 8,
    backgroundColor: '#323743',
    color: '#fff',
    paddingHorizontal: 10,
    marginHorizontal:10
  },
  button: {
    backgroundColor: '#FD002A',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 30,
    width: '50%',
    alignItems: 'center',
  },
  buttonDisabled: { 
    backgroundColor: '#FF6B8B',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {  
    color: '#E0E0E0',
  },
  signUpText: {
    marginTop: 20,
    color: '#FD002A',
    fontWeight: '500',
    textDecorationLine:'underline'
  },
 
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff0000ff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: '#FD002A',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
