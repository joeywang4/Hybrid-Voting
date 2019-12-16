import React from 'react';
import { Container, Header, Icon, Divider, Card } from 'semantic-ui-react';

const slides = [
  {
    name: "課程規定",
    link: "https://drive.google.com/open?id=13xTRQJ-6kB-pXT1lc2HsiBzfTwa5DKI8As2McGYNQ4U"
  },
  {
    name: "第一週投影片",
    link: "https://drive.google.com/open?id=1fSIgjCAoAOgrehZ5ZBqTNAX_d39SRPLRfkVQuTOava4"
  },
  {
    name: "第二週投影片",
    link: "https://drive.google.com/open?id=1AcrLcfrWG7UYA8lJJHRBx7klJFWqZWsOdlWJ-RGl0Y4"
  },
  {
    name: "第三週投影片",
    link: "https://drive.google.com/open?id=1hWI0CWMPQHwQyGXliDkyp2ohsM9-WIgT0NeVEIlqwlc"
  },
  {
    name: "第四週投影片",
    link: "https://drive.google.com/open?id=1GWOK5N9LEmnvj7A_i88WLRkUHhHA5JHEubHnm4v0134"
  },
  {
    name: "第五週投影片",
    link: "https://drive.google.com/open?id=1NwsZhGV4aH-awzRHLwv7rNAwM1qwMaTw2z1AB3hXKF8"
  }
]

const practices = [
  {
    name: "OverTheWire",
    description: "各式各樣的練習題，從Linux指令、Web、PWN、Crypto......等等應有盡有，難度偏易，適合初學者。",
    link: "https://overthewire.org/wargames/"
  },
  {
    name: "picoCTF 2018",
    description: "由CMU主辦給高中生比的CTF競賽，題目包羅萬象而且題數超多，適合CTF新手。",
    link: "https://2018game.picoctf.com"
  },
  {
    name: "Hack The Box",
    description: "各種類型的題目都有，但數量不多且偏難，光是註冊帳號就是一道題目。",
    link: "https://www.hackthebox.eu/"
  }
]

const Resources = () => {
  
  return (
    <Container>
      <div style={{marginTop: "2vh"}} />
      <Header as='h2' icon textAlign='center'>
        <Icon name='wifi' circular />
        <Header.Content>課程資源</Header.Content>
      </Header>
      <Divider horizontal>
        <Header size="small">
          <Icon name="slideshare" />
          投影片
        </Header>
      </Divider>
      <div style={{marginTop: "4vh"}} />
      <Card.Group centered>
        {slides.map(slide => {
          return (
            <Card
              link
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={slide.link}
              header={slide.name}
              key={slide.link}
              style={{textDecoration: 'none'}}
            />
          )
        })}
      </Card.Group>
      <div style={{marginTop: "5vh"}} />
      <Divider horizontal>
        <Header size="small">
          <Icon name="child" />
          CTF課外練習區
        </Header>
      </Divider>
      <div style={{marginTop: "2vh"}} />
      <Card.Group centered>
        {practices.map(practice => {
          return (
            <Card
              link
              as="a"
              target="_blank"
              rel="noopener noreferrer"
              href={practice.link}
              header={practice.name}
              description={practice.description}
              key={practice.link}
              style={{textDecoration: 'none'}}
            />
          )
        })}
      </Card.Group>
    </Container>
  );
}

export default Resources;