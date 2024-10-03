type ApifyWebhookPayload = {
    agentId: string;
    userId: string;
    createdAt: string;
    eventType: string;
    eventData: {
        actorId: string;
        actorRunId: string;
    };
    resource: {
        id: string;
        actId: string;
        userId: string;
        startedAt: string;
        finishedAt: string;
        status: string;
        statusMessage: string;
        isStatusMessageTerminal: boolean;
        meta: {
            origin: string;
            userAgent: string;
        };
        stats: {
            inputBodyLen: number;
            rebootCount: number;
            restartCount: number;
            durationMillis: number;
            resurrectCount: number;
            runTimeSecs: number;
            metamorph: number;
            computeUnits: number;
            memAvgBytes: number;
            memMaxBytes: number;
            memCurrentBytes: number;
            cpuAvgUsage: number;
            cpuMaxUsage: number;
            cpuCurrentUsage: number;
            netRxBytes: number;
            netTxBytes: number;
        };
        options: {
            build: string;
            timeoutSecs: number;
            memoryMbytes: number;
            diskMbytes: number;
        };
        buildId: string;
        exitCode: number;
        defaultKeyValueStoreId: string;
        defaultDatasetId: string;
        defaultRequestQueueId: string;
        buildNumber: string;
        containerUrl: string;
        usage: {
            ACTOR_COMPUTE_UNITS: number;
            DATASET_READS: number;
            DATASET_WRITES: number;
            KEY_VALUE_STORE_READS: number;
            KEY_VALUE_STORE_WRITES: number;
            KEY_VALUE_STORE_LISTS: number;
            REQUEST_QUEUE_READS: number;
            REQUEST_QUEUE_WRITES: number;
            DATA_TRANSFER_INTERNAL_GBYTES: number;
            DATA_TRANSFER_EXTERNAL_GBYTES: number;
            PROXY_RESIDENTIAL_TRANSFER_GBYTES: number;
            PROXY_SERPS: number;
        };
        usageTotalUsd: number;
        usageUsd: {
            ACTOR_COMPUTE_UNITS: number;
            DATASET_READS: number;
            DATASET_WRITES: number;
            KEY_VALUE_STORE_READS: number;
            KEY_VALUE_STORE_WRITES: number;
            KEY_VALUE_STORE_LISTS: number;
            REQUEST_QUEUE_READS: number;
            REQUEST_QUEUE_WRITES: number;
            DATA_TRANSFER_INTERNAL_GBYTES: number;
            DATA_TRANSFER_EXTERNAL_GBYTES: number;
            PROXY_RESIDENTIAL_TRANSFER_GBYTES: number;
            PROXY_SERPS: number;
        };
    };
};
