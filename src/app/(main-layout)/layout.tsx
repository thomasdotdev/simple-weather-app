import GlobalHeader from "@/components/block/global-header";

export default function MainLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <GlobalHeader />
      <main className="relative top-16 h-[calc(100dvh-64px)] w-full z-0 overflow-y-auto bg-accent flex justify-center">
        {props.children}
      </main>
    </>
  );
}
