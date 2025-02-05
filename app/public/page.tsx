export default function PublicPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Public Page</h1>
        <p>This page is accessible without authentication</p>
      </div>
    </div>
  );
}
