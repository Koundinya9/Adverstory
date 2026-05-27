import ProfileForm from "@/components/profile/ProfileForm";

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Brand Profile</h1>
      <p className="text-gray-500 mb-8">
        This info helps the AI generate ads tailored to your brand.
      </p>
      <ProfileForm />
    </div>
  );
}
