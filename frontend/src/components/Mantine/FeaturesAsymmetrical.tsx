import { createStyles, Text, SimpleGrid, Container, rem } from '@mantine/core';
import { BiLogIn } from 'react-icons/bi';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { FaGamepad } from 'react-icons/fa';

const useStyles = createStyles((theme) => ({
  feature: {
    position: 'relative',
    paddingTop: theme.spacing.xl,
    paddingLeft: theme.spacing.xl,
  },

  overlay: {
    position: 'absolute',
    height: rem(100),
    width: rem(160),
    top: 0,
    left: 0,
    backgroundColor: '#FF2D55',
    zIndex: 1,
  },

  content: {
    position: 'relative',
    zIndex: 2,
  },

  icon: {
    color: '#fff',
  },

  title: {
    color: 'var(--primary-color-light)',
  },
}));

interface FeatureProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: React.FC<any>;
  title: string;
  description: string;
}

function Feature({
  icon: Icon,
  title,
  description,
  className,
  ...others
}: FeatureProps) {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.feature, className)} {...others}>
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Icon size={rem(35)} className={classes.icon} stroke={1.5} />
        <Text fw={700} fz="lg" mb="xs" mt={5} className={classes.title}>
          {title}
        </Text>
        <Text c="dimmed" fz="sm">
          {description}
        </Text>
      </div>
    </div>
  );
}

const mockdata = [
  {
    icon: BiLogIn,
    title: 'Login using 42 intra',
    description:
      'It is said that happiness will come to those who see a gathering of Clefairy dancing under a full moon.',
  },
  {
    icon: BsFillChatDotsFill,
    title: 'Chat with your friends',
    description:
      'It is said that happiness will come to those who see a gathering of Clefairy dancing under a full moon',
  },
  {
    icon: FaGamepad,
    title: 'Play with your friends',
    description:
      'It is said that happiness will come to those who see a gathering of Clefairy dancing under a full moon',
  },
];

export function FeaturesAsymmetrical() {
  const items = mockdata.map((item) => <Feature {...item} key={item.title} />);

  return (
    <Container mt={30} mb={30} size="lg">
      <SimpleGrid
        cols={3}
        breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
        spacing={50}
      >
        {items}
      </SimpleGrid>
    </Container>
  );
}
