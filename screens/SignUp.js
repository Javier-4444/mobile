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
import { auth } from '../src/config/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUp({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validaciones de contraseña
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password === confirmPassword && confirmPassword !== '';

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && passwordsMatch;

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (!isPasswordValid) {
      Alert.alert("Error", "Por favor, cumple con todos los requisitos de la contraseña.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Registro exitoso", "Usuario registrado con éxito.");
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] }); 
    } catch (error) {
      let errorMessage = "Hubo un problema al registrar el usuario.";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "El correo electrónico ya está en uso.";
          break;
        case 'auth/invalid-email':
          errorMessage = "El formato del correo electrónico no es válido.";
          break;
        case 'auth/weak-password':
          errorMessage = "La contraseña es demasiado débil.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Error de conexión, por favor intenta más tarde.";
          break;
      }
      Alert.alert("Error", errorMessage);
    }
  };

  const PasswordRequirement = ({ met, text }) => (
    <View style={styles.requirementContainer}>
      <FontAwesome 
        name={met ? "check-circle" : "times-circle"} 
        size={16} 
        color={met ? "#4CAF50" : "#F44336"} 
      />
      <Text style={[styles.requirementText, { color: met ? "#4CAF50" : "#F44336" }]}>
        {text}
      </Text>
    </View>
  );

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
          <Image source={require('../assets/letras-santo-pecado.jpg')} style={styles.logo} resizeMode='contain' />
          <Text style={styles.title}>REGISTRATE AHORA</Text>

          <Text style={styles.label}>Nombre</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese su nombre"
              placeholderTextColor="#888"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <Text style={styles.label}>Apellido</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="user" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Ingrese su apellido"
              placeholderTextColor="#888"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

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

          <View style={styles.requirementsContainer}>
            <PasswordRequirement met={hasMinLength} text="Mínimo 6 caracteres" />
            <PasswordRequirement met={hasUpperCase} text="Al menos una mayúscula" />
            <PasswordRequirement met={hasLowerCase} text="Al menos una minúscula" />
            <PasswordRequirement met={hasNumber} text="Al menos un número" />
          </View>

          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#ccc" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirme su contraseña"
              placeholderTextColor="#888"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <FontAwesome name={showConfirmPassword ? "eye-slash" : "eye"} size={20} color="#ccc" />
            </TouchableOpacity>
          </View>

          <View style={styles.requirementsContainer}>
            <PasswordRequirement met={passwordsMatch} text="Las contraseñas coinciden" />
          </View>

          <TouchableOpacity 
            style={[styles.button, !isPasswordValid && styles.buttonDisabled]} 
            onPress={handleSignUp}
            disabled={!isPasswordValid}
          >
            <Text style={[styles.buttonText, !isPasswordValid && styles.buttonTextDisabled]}>
              Registrarse
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signUpText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
    marginBottom: 10,
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
  requirementsContainer: {
    width: '100%',
    marginBottom: 10,
  },
  requirementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  requirementText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#FD002A',
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
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
  },
});






