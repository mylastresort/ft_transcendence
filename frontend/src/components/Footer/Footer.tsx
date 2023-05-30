import { createStyles, Container, Group, ActionIcon, rem } from '@mantine/core';
import { FaGamepad } from 'react-icons/fa';
import { Image } from '@nextui-org/react';
import { AiFillGithub, AiFillLinkedin, AiFillFacebook } from 'react-icons/ai';

const useStyles = createStyles((theme) => ({
  footer: {
    marginTop: rem(120),
    borderTop: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    backgroundColor: '#141414',
    zIndex: 1,
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    backgroundColor: '#141414',
    zIndex: 1,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginTop: theme.spacing.md,
    },
  },
}));

export function Footer({ Show, isTwoFactorAuth }) {
  if (!Show || isTwoFactorAuth) return;
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Image src="/images/LOGO.png" />
        <Group spacing={0} className={classes.links} position="right" noWrap>
          <ActionIcon size="lg">
            <AiFillGithub size="1.05rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg">
            <AiFillLinkedin size="1.05rem" stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg">
            <AiFillFacebook size="1.05rem" stroke={1.5} />
          </ActionIcon>
        </Group>
      </Container>
    </div>
  );
}
