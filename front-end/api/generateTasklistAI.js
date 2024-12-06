import { HfInference } from '@huggingface/inference';

const generateAITaskList = async (input) => {
    try {
        console.log('fullResponse', input);
        const inference = new HfInference("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");
        const prompt = `Create a list of 10 to 12 briefed tasks with 3-4 words for event ${input} without heading, anything else`
        const response = await inference.chatCompletion({
            model: "microsoft/Phi-3-mini-4k-instruct", 
            messages: [{ role: "user", content: prompt }], 
            max_tokens: 500, 
        });

        const tasklist = response.choices[0]?.message?.content;
        console.log('stream', response.choices[0]?.message?.content);
        return tasklist;
    } catch (err) {
        return err
    }
};

export default generateAITaskList;