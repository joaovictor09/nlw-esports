export declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
      home: undefined;
      game: {
        id: string;
        title: string;
        bannerUrl: string;
      };
    }
  }
}
