import HomePage from "./Home/page";
import HomeLayout from "./Home/layout";

export default function Home() {
  return (
    <>
      <HomeLayout>
        <HomePage />
      </HomeLayout>
    </>
  );
}
