export default function CocukModuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // This layout wrapper ensures that the main site header is not displayed on any of the child mode pages.
  return <>{children}</>;
}
