import { Icon, Link } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import { FiExternalLink } from 'react-icons/fi';

export const ExternalLink = (props: PropsWithChildren<{ href: string }>) => {
    return (
        <Link href={props.href} isExternal color="blue.500">
            &nbsp;{props.children}&nbsp;
            <Icon as={FiExternalLink} />
            &nbsp;
        </Link>
    );
};
