import {
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Heading,
    useColorMode,
    useMediaQuery,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const Sidebar = (props: { onClose(): void; isOpen: boolean }) => {
    const [isLargeScreen] = useMediaQuery('(min-width: 1280px)');
    const { colorMode } = useColorMode();
    const router = useRouter();

    const show = !['/', '/login', '/register'].includes(router.asPath);

    if (!show) return null;

    const bgColor = { light: 'gray.100', dark: 'gray.900' };

    const color = { light: 'black', dark: 'white' };

    const contents = (
        <Heading size="lg" fontWeight="extrabold" ml="5">
            SIDEBAR
        </Heading>
    );

    return isLargeScreen ? (
        <Flex
            as="aside"
            width="300px"
            height="calc(100vh - 62px)"
            backgroundColor={bgColor[colorMode]}
            color={color[colorMode]}
            justifyContent="space-between"
            alignItems="center"
        >
            <Flex>{contents}</Flex>
        </Flex>
    ) : (
        <Drawer placement="left" onClose={props.onClose} isOpen={props.isOpen}>
            <DrawerOverlay mt="62px" />
            <DrawerContent mt="62px">
                {/* <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader> */}
                <DrawerBody>{contents}</DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
