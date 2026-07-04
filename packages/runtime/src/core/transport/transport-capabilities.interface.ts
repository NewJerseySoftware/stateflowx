export interface TransportCapabilities {

    /**
     * Indicates whether the transport supports bidirectional communication
     */
    readonly duplex: boolean;

    /**
     * Indicates whether the transport supports runtime event streaming
     */
    readonly supportsEvents: boolean;

    /**
     * Indicates whether the transport maintains a persistent connection.
     * 
     */
    readonly persistent: boolean;

}