import { Container } from 'semantic-ui-react';
import Header from './header';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      <Container>{children}</Container>
    </div>
  );
};

export default Layout;
