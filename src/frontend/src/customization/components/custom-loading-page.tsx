import LoadingComponent from "@/components/common/loadingComponent";

export function CustomLoadingPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <LoadingComponent remSize={20} />
    </div>
  );
}
