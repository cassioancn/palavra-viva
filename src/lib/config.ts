/**
 * Configurações Centrais do Projeto Palavra Viva
 * Parametrização para o domínio oficial https://palavra-vivallm.com.br
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://palavra-vivallm.com.br";

export const SITE_DOMAIN = "palavra-vivallm.com.br";

export const SITE_NAME = "Palavra Viva";

export const SITE_TITLE = "Palavra Viva — Consolo & Direção na Bíblia Sagrada";

export const SITE_DESCRIPTION =
  "Compartilhe o que você está sentindo e receba uma passagem real da Bíblia Sagrada com reflexão pastoral e oração, 100% livre de alucinações.";

export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contato@palavra-vivallm.com.br";

export const PIX_KEY =
  process.env.NEXT_PUBLIC_PIX_KEY || "f84f3560-de18-4c7a-b571-622465e50011";

export const PIX_RECIPIENT =
  process.env.NEXT_PUBLIC_PIX_NAME || "Projeto Palavra Viva";

export const CVV_PHONE = "188";
export const CVV_URL = "https://cvv.org.br";

export const AMAZON_ASSOCIATE_TAG =
  process.env.NEXT_PUBLIC_AMAZON_TAG || "palavraviva01-20";

export const AMAZON_DISCLOSURE =
  "Na qualidade de Associado da Amazon, eu recebo por compras qualificadas.";
