"use client";

import axios from "axios";
import * as z from "zod"
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { Heading } from "@/components/heading";

import {
    Form,
    FormControl,
    FormField, FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Empty } from "@/components/empty";

import { formSchema } from "./constants";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { UserAvavtar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import { useProModel } from "@/hooks/use-pro-modal";
import { toast } from "react-hot-toast";

const ConversationPage = () => {
    const proModal = useProModel();
    const router = useRouter();
    const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            throw new Error("Something")
            const userMessage: ChatCompletionRequestMessage = {
                role: "user",
                content: values.prompt,
            }

            const newMessages = [...messages, userMessage];

            const responce = await axios.post('/api/conversation', {
                messages: newMessages,
            })
            setMessages((current) => [...current, userMessage, responce.data])
            form.reset();
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            }else{
                toast.error("Something went wrong");
            }
        } finally {
            router.refresh()
        }
    }

    return (
        <div>
            <Heading
                title="Conversation"
                description="Our most advanced conversation model."
                icon={MessageSquare}
                iconColor="text-violet-500"
                bgColor="bg-violet-500/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="inline-grid rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm gird grid-cols-12 gap-2">
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0
                                        focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="How do I calculate the radius of circle?"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="col-span-12 lg:col-span-2"
                                disabled={isLoading} >
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full fle' items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <Empty label="No conversation started" />
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.content}
                                className={cn(
                                    "p-8 w-full items-start gap-x-8 rounded-lg inline-flex ", message.role === "user" ? "bg-white border border-black/10" : "bg-muted"
                                )}
                            >
                                {message.role === "user" ? <UserAvavtar /> : <BotAvatar />}
                                <p className="text-sm">
                                    {message.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConversationPage;