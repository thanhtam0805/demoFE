import React from 'react';
import { FacebookOutlined, TwitterOutlined, InstagramOutlined, LinkedinOutlined } from '@ant-design/icons';
import {
    PageContainer,
    ContentWrapper,
    FooterContainer,
    FooterContent,
    FooterSection,
    FooterTitle,
    FooterText,
    FooterLinks,
    FooterLink,
    FooterBottom,
    SocialIcons,
    SocialIcon
} from './style';

const FooterComponent = ({ children }) => {
    return (
        <PageContainer>
            <ContentWrapper>
                {children}
            </ContentWrapper>
            <FooterContainer>
                <FooterContent>
                    <FooterSection>
                        <FooterTitle>About Us</FooterTitle>
                        <FooterText>
                            We are a leading e-commerce store offering the best products at the best prices.
                            Our mission is to provide quality products with excellent customer service.
                        </FooterText>
                    </FooterSection>
                    <FooterSection>
                        <FooterTitle>Quick Links</FooterTitle>
                        <FooterLinks>
                            <FooterLink href="/about">About Us</FooterLink>
                            <FooterLink href="/products">Products</FooterLink>
                            <FooterLink href="/contact">Contact Us</FooterLink>
                            <FooterLink href="/faq">FAQ</FooterLink>
                        </FooterLinks>
                    </FooterSection>
                    <FooterSection>
                        <FooterTitle>Contact</FooterTitle>
                        <FooterText>123 E-commerce St., Business City</FooterText>
                        <FooterText>Phone: +1 234 567 890</FooterText>
                        <FooterText>Email: estorevn84@gmail.com</FooterText>
                    </FooterSection>
                    <FooterSection>
                        <FooterTitle>Follow Us</FooterTitle>
                        <SocialIcons>
                            <SocialIcon href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                                <FacebookOutlined />
                            </SocialIcon>
                            <SocialIcon href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <TwitterOutlined />
                            </SocialIcon>
                            <SocialIcon href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                                <InstagramOutlined />
                            </SocialIcon>
                            <SocialIcon href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                <LinkedinOutlined />
                            </SocialIcon>
                        </SocialIcons>
                    </FooterSection>
                </FooterContent>
                <FooterBottom>&copy; {new Date().getFullYear()} EStore. All rights reserved.</FooterBottom>
            </FooterContainer>
        </PageContainer>
    );
};

export default FooterComponent;
