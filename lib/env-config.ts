// IMPORTANT: When adding new env variables to the codebase, update this array
export const ENV_VARIABLES: EnvVariable[] = [
  {
    name: "DATABASE_URL",
    description: "PostgreSQL database connection string for migrations and server-side operations",
    required: true,
    instructions: "Set up a PostgreSQL database (local or cloud) and provide the full connection string in format: postgresql://username:password@host:port/database"
  },
  {
    name: "NEXTAUTH_SECRET",
    description: "Secret key for NextAuth.js session encryption and security",
    required: true,
    instructions: "Generate a secure random string: `openssl rand -base64 32` or use any secure random string generator"
  },
  {
    name: "NEXTAUTH_URL",
    description: "Base URL of your application for NextAuth.js callbacks",
    required: false,
    instructions: "Set to your application's base URL (e.g., http://localhost:3000 for development, https://yourdomain.com for production)"
  }
];

export interface EnvVariable {
  name: string
  description: string
  instructions: string
  required: boolean
}

export function checkMissingEnvVars(): string[] {
  return ENV_VARIABLES.filter(envVar => envVar.required && !process.env[envVar.name]).map(envVar => envVar.name)
}