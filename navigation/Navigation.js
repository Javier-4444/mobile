import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';  
import { auth } from '../src/config/firebaseConfig';  
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setIsAuthenticated(true); 
      } else {
        setIsAuthenticated(false); 
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent"
        translucent={true}
      />
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName={isAuthenticated ? "Home" : "Login"}
          screenOptions={{
            headerStyle: {
              backgroundColor: '#000000',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            cardStyle: {
              backgroundColor: '#000000',
            },
          }}
        >
          <Stack.Screen 
            name="Login" 
            component={Login}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="SignUp" 
            component={SignUp}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="Home" 
            component={Home}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default Navigation;





// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { onAuthStateChanged } from 'firebase/auth';  
// import { auth } from '../src/config/firebaseConfig';  
// import Login from '../screens/Login';
// import SignUp from '../screens/SignUp';
// import Home from '../screens/Home';
// import { StatusBar } from 'react-native';

// const Stack = createStackNavigator();

// function Navigation() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

  


//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, user => {
//       if (user) {
//         setIsAuthenticated(true); 
//       } else {
//         setIsAuthenticated(false); 
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <>
//       <StatusBar 
//         barStyle="light-content" 
//         backgroundColor="transparent"
//         translucent={true}
//       />
//       <NavigationContainer>
//         <Stack.Navigator 
//           initialRouteName={isAuthenticated ? "Home" : "Login"}
//           screenOptions={{
//             headerStyle: {
//               backgroundColor: '#000000',
//             },
//             headerTintColor: '#fff',
//             headerTitleStyle: {
//               fontWeight: 'bold',
//             },
//             cardStyle: {
//               backgroundColor: '#000000',
//             },
//           }}
//         >
//           <Stack.Screen 
//             name="Login" 
//             component={Login}
//             options={{
//               headerShown: false,
//             }}
//           />
//           <Stack.Screen 
//             name="SignUp" 
//             component={SignUp}
//             options={{
//               headerShown: false,
//             }}
//           />
//           <Stack.Screen 
//             name="Home" 
//             component={Home}
//             options={{
//               headerShown: false,
//             }}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </>
//   );
// }


// export default Navigation;




