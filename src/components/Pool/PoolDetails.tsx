import React, { useEffect, useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { UserAuth } from '@/app/firebase/AuthContext';
import Link from 'next/link';
import { Badge } from '../ui/badge';

export default function PoolDetails(props: any) {
    const { loading, getPoolData, user } = UserAuth();
    const [clientLoading, setClientLoading] = useState(true);
    const [poolData, setPoolData] = useState(null);

    useEffect(() => {
            const getPool = async () => {
                const poolData = await getPoolData(props.pool);
                setPoolData(poolData);
                setClientLoading(false);
                console.log(poolData);
            };
            getPool();
    }, []);



    if (clientLoading) return <div>Loading...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-row gap-2 items-center">
                    {poolData?.poolName}{' '}
                    {poolData?.poolOwner === user.uid ? <Badge>You own this pool</Badge> : null}
                </CardTitle>
                <CardDescription>{poolData?.poolDescription}</CardDescription>
            </CardHeader>
            <CardFooter className="border-t px-6 py-4 flex flex-row gap-2">
                <Button variant="default" asChild>
                    <Link href={`/pool?id=${poolData?.poolID}`}>View Pool</Link>
                </Button>
                <Button variant="destructive">Leave Pool</Button>
            </CardFooter>
        </Card>
    );
}
