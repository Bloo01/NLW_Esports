import React, { useEffect, useState } from "react";
import { View, Image, TouchableOpacity, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { styles } from "./styles";
import logoImg from "../../assets/logo-nlw-esports.png";
import { Entypo } from "@expo/vector-icons";
import {
  Header,
  DuoCardProps,
  Background,
  DuoCard,
  DuoMatch,
} from "../../components";
import { THEME } from "../../theme";

interface GameParams {
  id: string;
  title: string;
  bannerUrl: string;
}



const Game = () => {
  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState('');
  
  async function getDiscordUser(adsId:string) {
    fetch(`http://192.168.0.244:3333/ads/${adsId}/discord`)
    .then(response => response.json())
    .then(data=>setDiscordDuoSelected(data.discord))
    
  }


  useEffect(() => {
    fetch(`http://192.168.0.244:3333/games/${game.id}/ads`)
      .then((response) => response.json())
      .then((data) => setDuos(data));
  }, []);

  const route = useRoute();
  const game = route.params as GameParams;
  const navigation = useNavigation();
  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>
          <Image source={logoImg} style={styles.logo} />
          <View style={styles.right} />
        </View>
        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
        <Header title={game.title} subtitle="Conecte-se e comece a jogar!" />
        <FlatList
          data={duos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item}
            onConnect={()=>getDiscordUser(item.id)} />
            
          )}
          horizontal
          style={styles.containerList}
          contentContainerStyle={[
            duos.length === 0 ? styles.contentList : styles.emptyListContent,
          ]}
          showsHorizontalScrollIndicator={false}
          ListEmptyComponent={() => {
            return (
              <Text style={styles.emptyListText}>
                Não há anúncio publicados ainda :/ .
              </Text>
            );
          }}
        />
        <DuoMatch
          visible={discordDuoSelected.length > 0}
          discord= {discordDuoSelected}
          onClose={()=> setDiscordDuoSelected('')}
        />
      </SafeAreaView>
    </Background>
  );
};

export default Game;