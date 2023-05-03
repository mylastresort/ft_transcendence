import {
	Button,
	Text,
	Image,
	Grid,
	Container,
	Spacer,
	Dropdown,
  } from '@nextui-org/react';
import Styles from './style.module.css';
import '@fontsource/poppins';


export function AboutBanner() {
  return (
	<Grid className={Styles.Banner_layout}>
		<Container lg direction="row" display="flex">
				<Image src="/images/pingpong_bg.jpg" />
			<Grid css={{width : "50%"}}>
			<Text
			h2
                style={{
                  fontFamily: 'Baumans',
                  fontSize: '2.5rem',
                  fontWeight: '500',
                }}
              >
                About The Game
              </Text>
			  <Text style={{
                  fontFamily: 'poppins',
                  fontSize: '1rem',
                  fontWeight: '500',
                }} >
			  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here',
			  </Text>
			  <Spacer y={1} />
			  <Button auto color="error" css={{fontFamily : "poppins", fontSize : "1.1rem", fontWeight : "600", padding : "22px 30px"}} >
				Play Now
			  </Button>
			</Grid>
		</Container>
	</Grid>
  );
}