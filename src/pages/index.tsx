import { VStack } from '@chakra-ui/react';
import { Hero } from '../components/Hero';

const Index = () => {
    return (
        <>
            <Hero />
            <VStack>
                <h3 id="features">Features</h3>
                <h3 id="pricing">Pricing</h3>
                <h3 id="legal">Legal</h3>
                <h3 id="about">About</h3>
                <p>
                    CODEX, © 2021 Vadim Galaktionov. Hero image by&nbsp;
                    <a href="https://unsplash.com/@singlepinkc"> hao&nbsp;qin</a>&nbsp;on&nbsp;
                    <a href="http://unsplash.com"> Unsplash</a>.
                </p>
            </VStack>
        </>
    );
};

export default Index;
