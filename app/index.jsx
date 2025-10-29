import { Redirect } from 'expo-router';

export default function Index() {
  // This will automatically redirect users to the Register page upon app start
  return <Redirect href="/Login" />;
}
