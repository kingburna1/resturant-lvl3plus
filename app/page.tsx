import WalkInRestaurantNavbar from '@/src/components/WalkInRestaurantNavbar';
import HeroVideoSection from '@/src/components/HeroVideoSection';
import MenuStateProvider from '@/src/components/MenuStateProvider';
import Footer from '@/src/components/Footer';

export default function Home() {
  return (
    <div className="">
     <WalkInRestaurantNavbar/>
     <HeroVideoSection/>
      <MenuStateProvider/>
      <Footer/>
    </div>
  );
}
