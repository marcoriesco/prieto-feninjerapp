import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { BottomNav, Toaster, TopBar } from './components/ui';
import { useApp } from './store';
import { Login, Register } from './pages/Auth';
import { Home } from './pages/Home';
import { ProductPage, StorePage, Stores } from './pages/Stores';
import { Cart, Checkout, QuoteSent } from './pages/Quote';
import { MapPage } from './pages/MapPage';
import { Agenda } from './pages/Agenda';
import { Hotels } from './pages/Hotels';
import { Profile } from './pages/Profile';
import { TalkDetail, Talks } from './pages/Talks';

function RequireAuth() {
  const { user } = useApp();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <Outlet />;
}

/** Telas principais: barra superior + navegação inferior. */
function TabLayout() {
  return (
    <>
      <TopBar />
      <main className="pb-nav">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}

/** Telas internas com cabeçalho próprio, mantendo a navegação inferior. */
function InnerLayout() {
  return (
    <>
      <main className="pb-nav">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}

export default function App() {
  const { user } = useApp();
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-frame">
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/cadastro" element={user ? <Navigate to="/" replace /> : <Register />} />
        <Route element={<RequireAuth />}>
          <Route element={<TabLayout />}>
            <Route index element={<Home />} />
            <Route path="lojas" element={<Stores />} />
            <Route path="mapa" element={<MapPage />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="orcamento" element={<Cart />} />
          </Route>
          <Route element={<InnerLayout />}>
            <Route path="lojas/:id" element={<StorePage />} />
            <Route path="hospedagem" element={<Hotels />} />
            <Route path="palestras" element={<Talks />} />
            <Route path="palestras/:id" element={<TalkDetail />} />
            <Route path="perfil" element={<Profile />} />
          </Route>
          {/* telas com barra de ação fixa no rodapé */}
          <Route path="produto/:id" element={<ProductPage />} />
          <Route path="checkout/:storeId" element={<Checkout />} />
          <Route path="enviado/:quoteId" element={<QuoteSent />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}
