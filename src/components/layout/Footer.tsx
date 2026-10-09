import { Brand } from './Header';
import { site } from '../../config/site';
export function Footer() {
    return <footer className="site-footer"><div className="container"><div className="footer-top"><a href="#inicio" aria-label="Voltar ao início"><Brand /></a><p>Fogo, sabor e atitude.<br />Do primeiro ao último pedaço.</p><nav aria-label="Rodapé"><a href="#cardapio">Cardápio</a><a href="#sobre">Sobre</a><a href="#localizacao">Localização</a></nav></div><div className="footer-bottom"><span>BRASA 73 • Projeto demonstrativo. Negócio fictício.</span><span>Desenvolvido por {site.portfolioUrl ? <a href={site.portfolioUrl}>Eugênio Prado</a> : 'Eugênio Prado'}</span></div></div></footer>;
}
