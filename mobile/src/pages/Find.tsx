import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Heading, useToast, VStack } from "native-base";
import { useCallback, useState } from "react";
import Logo from "../assets/logo.svg";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

export function Find() {
  const toast = useToast();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");

  useFocusEffect(
    useCallback(() => {
      setIsLoading(false);
      setCode("");
    }, [])
  );

  async function handleJoinPool() {
    try {
      setIsLoading(true);
      if (!code.trim()) {
        toast.show({
          title: "Informe o código do bolão",
          placement: "top",
          bgColor: "red.500",
        });

        setIsLoading(false);
        return;
      }

      const response = await api.post("/pools/join", { code });
      console.log("dfadfa");
      toast.show({
        title: "Você entrou no bolão com sucesso",
        placement: "top",
        bgColor: "green.500",
      });

      navigation.navigate("pools");
    } catch (error) {
      console.log("handleJoinPool", error, error.response?.data?.message);
      setIsLoading(false);

      if (error.response?.data?.message === "Pool not found.") {
        return toast.show({
          title: "Bolão não encontrado",
          placement: "top",
          bgColor: "red.500",
        });
      }
      if (error.response?.data?.message === "You already joined this pool.") {
        return toast.show({
          title: "Você já está nesse bolão!",
          placement: "top",
          bgColor: "red.500",
        });
      }

      toast.show({
        title: "Não foi possível encontrar bolão",
        placement: "top",
        bgColor: "red.500",
      });
    }
  }
  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />
      <VStack mt={8} mx={5} alignItems="center">
        <Logo />
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          my={8}
          textAlign="center"
        >
          Encontre um bolão através de {"\n"}
          seu código único
        </Heading>
        <Input
          mb={2}
          placeholder="Qual nome do seu bolão?"
          autoCapitalize="characters"
          value={code}
          onChangeText={setCode}
        />
        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
