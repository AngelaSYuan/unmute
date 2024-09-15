import Logo from './assets/logo_black.png';
import SymphonicLogo from './assets/symphonic_logo.png';

const Header = () => {
    return (
        <>
            <img src={Logo} alt="Logo" style={{ width: '118px', marginBottom:'50px'}}/>
            <div className="tag" style={{marginBottom:'24px'}}>
                <img src={SymphonicLogo} alt="Symphonic Logo" style={{ width: '24px'}}/>
                Powered by Symphonic
            </div>
        </>
    )
}
export default Header;