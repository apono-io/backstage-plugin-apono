export interface Config {
  apono: {
     /**
     * Frontend root URL
     * @visibility frontend
     */
    clientUrl?: string;

    /**
     * Support links
     * @visibility frontend
     */
    supportLinks?: {
      /**
      * Support link label
      * @visibility frontend
      */
      label: string;

      /**
      * Support link value
      * @visibility frontend
      */
      value: string;

      /**
      * Support link URL
      * @visibility frontend
      */
      url: string;
    }[];

    /**
     * Enable safe Safari check
     * @visibility frontend
     */
    enableSafeSafariCheck?: boolean;
  };
}
