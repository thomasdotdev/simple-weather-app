import GlobalHeader from "@/components/block/global-header";

export default function MainLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <GlobalHeader />
      <main className="relative px-2 top-16 h-[calc(100dvh-64px)] w-full z-0 overflow-y-auto bg-accent flex justify-center">
        <div className="flex flex-col gap-4 pt-4 max-w-screen-xs w-full items-center justify-start">
          {props.children}
        </div>
      </main>
    </>
  );
}
