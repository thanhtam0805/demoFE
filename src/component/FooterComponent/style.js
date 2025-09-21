import styled from 'styled-components';

export const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
     min-height: 100vh; 
`;

export const ContentWrapper = styled.div`
    flex: 1;
`;

export const FooterContainer = styled.footer`
    background-color: #E30019; 
    color: #ffffff;
    padding: 10px 0;
    text-align: left;
    width: 100%;
    margin-top: auto; 
    
`;

export const FooterContent = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
`;

export const FooterSection = styled.div`
    flex: 1;
    min-width: 200px;
`;

export const FooterTitle = styled.h3`
    font-size: 18px;
    margin-bottom: 15px;
    color: #ffe4e1; /* Slightly lighter shade of white-pink */
`;

export const FooterText = styled.p`
    font-size: 14px;
    color: #f5f5f5; /* Light gray for readability */
    line-height: 1.6;
`;

export const FooterLinks = styled.ul`
    list-style-type: none;
    padding: 0;
`;

export const FooterLink = styled.a`
    display: block;
    font-size: 14px;
    color: #f5f5f5;
    margin-bottom: 8px;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
        color: #ffcccb; /* Lighter red for hover effect */
    }
`;

export const FooterBottom = styled.div`
    text-align: center;
    margin-top: 30px;
    font-size: 14px;
    color: #f5f5f5;
    padding-top: 20px;
    border-top: 1px solid #ff7f7f; /* Slightly darker red for a subtle border */
`;

export const SocialIcons = styled.div`
    display: flex;
    gap: 15px;
    margin-top: 10px;
`;

export const SocialIcon = styled.a`
    font-size: 20px;
    color: #f5f5f5;
    transition: color 0.3s;

    &:hover {
        color: #ffcccb;
    }
`;
