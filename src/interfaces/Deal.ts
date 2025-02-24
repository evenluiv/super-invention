export interface Deal {
    title: string;
    value?: number;
    label?: string[];
    currency?: string;
    user_id?: number;
    person_id?: number;
    org_id?: number;
    pipeline_id?: number;
    stage_id?: number;
    status?: "open" | "won" | "lost" | "deleted";
    origin_id?: string;
    channel?: number;
    channel_id?: string;
    add_time?: string;
    won_time?: string;
    lost_time?: string;
    close_time?: string;
    expected_close_date?: string;
    probability?: number;
    lost_reason?: string;
    visible_to?: "1" | "3" | "5" | "7";
}

export type UpdateDeal = Partial<Deal>;
