export async function generateStaticParams() {
  // For now, return an empty array
  return [];
  // When you're ready to implement this, you can use something like:
  // const userIds = await fetchUserIds();
  // return userIds.map((id) => ({ userId: id }));
}

export default function OneTimeChatRequestPage({ params }: { params: { userId: string } }) {
  const { userId } = params;

  return (
    <div>
      <h1>One-Time Chat Request</h1>
      <p>User ID: {userId}</p>
      {/* Add your page content here */}
    </div>
  );
}